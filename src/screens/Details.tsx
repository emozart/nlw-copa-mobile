import { useEffect, useState } from "react";
import { Share } from "react-native";
import { VStack, Heading, useToast, HStack } from "native-base";
import { Header } from "../components/Header";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { PoolCardPros } from "../components/PoolCard";
import { api } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [option, setOption] = useState<"Guesses" | "Ranking">("Guesses");
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  );
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);

      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Venha participar do bolão ${poolDetails.title} comigo! Código: ${poolDetails.code}`,
      });
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível compartilhar o bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        onShare={handleShare}
        showBackButton
        showShareButton
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Palpites"
              isSelected={option === "Guesses"}
              onPress={() => setOption("Guesses")}
            />
            <Option
              title="Ranking"
              isSelected={option === "Ranking"}
              onPress={() => setOption("Ranking")}
            />
          </HStack>
          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
